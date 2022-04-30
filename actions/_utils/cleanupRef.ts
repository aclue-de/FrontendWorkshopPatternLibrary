export const cleanupRef = (ref: string) => ref.replace(/[\W_-]/g, "").replace("refsheads", "")
