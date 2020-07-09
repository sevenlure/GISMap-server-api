export async function getListWithPagination({ page = 1, pageSize = 20, ...query }, { field = [], sort = {} }) {
  page = parseInt(page)
  pageSize = parseInt(pageSize)
  const total = await this.find(query).countDocuments()

  const pagination = {
    total,
    page,
    pageSize,
    minIndex: (page - 1) * pageSize,
    maxIndex: page * pageSize < total ? page * pageSize : total
  }

  let list = await this.find(query)
    .select(field)
    .sort(sort)
    .skip(pagination.minIndex)
    .limit(pageSize)

  return {
    pagination,
    list
  }
}
