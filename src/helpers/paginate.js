export default function paginate(items, page, pageSize) {
  const totalPages = Math.ceil(items.length / pageSize);
  const paginated = items.slice((page - 1) * pageSize, page * pageSize);
  return { paginated, totalPages };
}