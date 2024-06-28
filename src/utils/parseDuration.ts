const parseDuration = (duration: string): number => {
  const timeUnits: { [key: string]: number } = {
    s: 1000,
    m: 1000 * 60,
    h: 1000 * 60 * 60,
    d: 1000 * 60 * 60 * 24,
  };

  const match = duration.match(/^(\d+)([smhd])$/);
  if (!match) {
    throw new Error("Invalid duration format");
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  return value * timeUnits[unit];
};

export default parseDuration;
