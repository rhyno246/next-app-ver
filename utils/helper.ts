export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .normalize("NFD")            // xoá dấu tiếng Việt
    .replace(/[\u0300-\u036f]/g, "") 
    .replace(/[^a-z0-9]+/g, "-") // thay khoảng trắng & ký tự đặc biệt bằng "-"
    .replace(/^-+|-+$/g, "");    // xoá "-" đầu & cuối
}