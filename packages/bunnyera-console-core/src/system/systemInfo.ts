import si from "systeminformation";

export interface SystemInfo {
  os: {
    platform: string;
    distro: string;
    release: string;
    arch: string;
  };
  cpu: {
    manufacturer: string;
    brand: string;
    cores: number;
  };
  memory: {
    total: number;
    free: number;
  };
  versions: {
    node: string;
    electron?: string;
    chrome?: string;
    consoleVersion?: string;
  };
}

export async function getSystemInfo(consoleVersion?: string): Promise<SystemInfo> {
  const [osInfo, cpuInfo, memInfo] = await Promise.all([
    si.osInfo(),
    si.cpu(),
    si.mem()
  ]);

  return {
    os: {
      platform: osInfo.platform,
      distro: osInfo.distro,
      release: osInfo.release,
      arch: osInfo.arch
    },
    cpu: {
      manufacturer: cpuInfo.manufacturer,
      brand: cpuInfo.brand,
      cores: cpuInfo.cores
    },
    memory: {
      total: memInfo.total,
      free: memInfo.free
    },
    versions: {
      node: process.version,
      electron: process.versions.electron,
      chrome: process.versions.chrome,
      consoleVersion
    }
  };
}
