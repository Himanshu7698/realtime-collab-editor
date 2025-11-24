export const formatDateIST = (date: string) => {
    const d = new Date(date).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    return d.replace(/\//g, "-"); // convert 24/11/2025 → 24-11-2025
};
