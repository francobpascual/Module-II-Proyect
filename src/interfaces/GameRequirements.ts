
export interface HardwareRequirements {
  cpu: string;
  gpu: string;
  ramGB: number;
  storageGB: number;
  os: string;
}

export interface GameSystemRequirements {
  minimum: HardwareRequirements;
  recommended?: HardwareRequirements;
}

export type CompatibilityStatus =
  | "compatible"
  | "not-compatible"
  | "review-required";

export interface ComponentCompatibility {
  component: "cpu" | "gpu" | "ram" | "storage" | "os";
  required: string;
  available: string;
  status: CompatibilityStatus;
  reason: string;
}

export interface GameCompatibilityResult {
  gameId: string;
  minimum: {
    status: CompatibilityStatus;
    components: ComponentCompatibility[];
  };
  recommended?: {
    status: CompatibilityStatus;
    components: ComponentCompatibility[];
  };
}
