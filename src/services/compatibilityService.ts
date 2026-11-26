
import type { Game } from "../interfaces/Game";
import type {
  HardwareRequirements,
  ComponentCompatibility,
  CompatibilityStatus,
  GameCompatibilityResult,
} from "../interfaces/GameRequirements";
import type { PCSpecs } from "../components/PCProfileBridge/PCProfileBridge";

type CompatibilityComponent =
  ComponentCompatibility["component"];

function createResult(
  component: CompatibilityComponent,
  required: string,
  available: string,
  status: CompatibilityStatus,
  reason: string
): ComponentCompatibility {
  return {
    component,
    required,
    available,
    status,
    reason,
  };
}

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[®™©]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function compareHardwareName(
  component: "cpu" | "gpu",
  required: string,
  available: string
): ComponentCompatibility {
  const normalizedRequired = normalizeText(required);
  const normalizedAvailable = normalizeText(available);

  if (!normalizedRequired || !normalizedAvailable) {
    return createResult(
      component,
      required,
      available || "No detectado",
      "review-required",
      "No hay información suficiente para comparar los modelos."
    );
  }

  if (normalizedRequired === normalizedAvailable) {
    return createResult(
      component,
      required,
      available,
      "compatible",
      "El modelo detectado coincide con el requerido."
    );
  }

  return createResult(
    component,
    required,
    available,
    "review-required",
    "Los modelos son diferentes. Se necesita una comparación de rendimiento."
  );
}

function compareCPU(
  required: string,
  pc: PCSpecs
): ComponentCompatibility {
  return compareHardwareName(
    "cpu",
    required,
    pc.CPU?.Name ?? ""
  );
}

function compareGPU(
  required: string,
  pc: PCSpecs
): ComponentCompatibility {
  const gpuNames = Array.isArray(pc.GPUs)
    ? pc.GPUs.map((gpu) => gpu.Name).filter(Boolean)
    : [];

  if (gpuNames.length === 0) {
    return createResult(
      "gpu",
      required,
      "No detectada",
      "review-required",
      "No se detectó información de la placa de video."
    );
  }

  const results = gpuNames.map((gpuName) =>
    compareHardwareName("gpu", required, gpuName)
  );

  const matchingGPU = results.find(
    (result) => result.status === "compatible"
  );

  if (matchingGPU) {
    return matchingGPU;
  }

  return createResult(
    "gpu",
    required,
    gpuNames.join(", "),
    "review-required",
    "Es necesario comparar el rendimiento de las placas de video."
  );
}

function compareRAM(
  requiredGB: number,
  pc: PCSpecs
): ComponentCompatibility {
  const availableGB = pc.RAMGB;

  if (
    !Number.isFinite(availableGB) ||
    availableGB <= 0
  ) {
    return createResult(
      "ram",
      `${requiredGB} GB`,
      "No detectada",
      "review-required",
      "No se pudo determinar la memoria RAM."
    );
  }

  const compatible = availableGB >= requiredGB;

  return createResult(
    "ram",
    `${requiredGB} GB`,
    `${availableGB} GB`,
    compatible ? "compatible" : "not-compatible",
    compatible
      ? "La memoria RAM cumple el requisito."
      : "La memoria RAM es inferior a la requerida."
  );
}

function compareStorage(
  requiredGB: number,
  pc: PCSpecs
): ComponentCompatibility {
  const disks = Array.isArray(pc.Disks)
    ? pc.Disks.filter(
        (disk) =>
          Number.isFinite(disk.FreeGB) &&
          disk.FreeGB >= 0
      )
    : [];

  if (disks.length === 0) {
    return createResult(
      "storage",
      `${requiredGB} GB libres`,
      "No detectado",
      "review-required",
      "No se pudo determinar el espacio disponible."
    );
  }

  const bestDisk = disks.reduce((best, current) =>
    current.FreeGB > best.FreeGB ? current : best
  );

  const compatible = bestDisk.FreeGB >= requiredGB;

  return createResult(
    "storage",
    `${requiredGB} GB libres`,
    `${bestDisk.FreeGB} GB libres en ${bestDisk.Drive}`,
    compatible ? "compatible" : "not-compatible",
    compatible
      ? "Existe una unidad con espacio suficiente."
      : "Ninguna unidad detectada tiene suficiente espacio libre."
  );
}

function getWindowsVersion(
  value: string
): number | null {
  const normalized = normalizeText(value);

  const match = normalized.match(/\bwindows\s+(10|11)\b/);

  return match ? Number(match[1]) : null;
}

function is64Bit(value: string): boolean {
  return /64[\s-]?(bit|bits)|x64|amd64/i.test(value);
}

function compareOS(
  required: string,
  pc: PCSpecs
): ComponentCompatibility {
  const available = [
    pc.OS?.Name,
    pc.OS?.Architecture,
  ]
    .filter(Boolean)
    .join(" · ");

  const requiredVersion = getWindowsVersion(required);
  const availableVersion = getWindowsVersion(
    pc.OS?.Name ?? ""
  );

  if (!requiredVersion || !availableVersion) {
    return createResult(
      "os",
      required,
      available || "No detectado",
      "review-required",
      "No se pudo verificar automáticamente el sistema operativo."
    );
  }

  if (requiredVersion !== availableVersion) {
    return createResult(
      "os",
      required,
      available,
      "review-required",
      "Las versiones de Windows son diferentes. Debe revisarse su compatibilidad."
    );
  }

  if (
    is64Bit(required) &&
    !is64Bit(pc.OS?.Architecture ?? "")
  ) {
    return createResult(
      "os",
      required,
      available,
      "review-required",
      "No se pudo confirmar la arquitectura de 64 bits."
    );
  }

  return createResult(
    "os",
    required,
    available,
    "compatible",
    "La versión de Windows coincide con la requerida."
  );
}

function evaluateRequirements(
  requirements: HardwareRequirements,
  pc: PCSpecs
) {
  const components: ComponentCompatibility[] = [
    compareCPU(requirements.cpu, pc),
    compareGPU(requirements.gpu, pc),
    compareRAM(requirements.ramGB, pc),
    compareStorage(requirements.storageGB, pc),
    compareOS(requirements.os, pc),
  ];

  let status: CompatibilityStatus = "compatible";

  if (
    components.some(
      (component) => component.status === "not-compatible"
    )
  ) {
    status = "not-compatible";
  } else if (
    components.some(
      (component) => component.status === "review-required"
    )
  ) {
    status = "review-required";
  }

  return {
    status,
    components,
  };
}

export const compatibilityService = {
  check(
    game: Game,
    pc: PCSpecs
  ): GameCompatibilityResult | null {
    const requirements = game.systemRequirements;

    if (!requirements) {
      return null;
    }

    return {
      gameId: game.id,
      minimum: evaluateRequirements(
        requirements.minimum,
        pc
      ),
      recommended: requirements.recommended
        ? evaluateRequirements(
            requirements.recommended,
            pc
          )
        : undefined,
    };
  },
};
