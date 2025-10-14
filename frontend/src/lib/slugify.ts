export default function slugify(str: string) {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // remove special chars
      .trim()
      .replace(/\s+/g, "-"); // spaces → dashes
  }
  