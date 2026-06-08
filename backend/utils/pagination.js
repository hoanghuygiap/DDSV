function getPagination(query) {
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.max(Number(query.limit) || 10, 1);
    const offset = (page - 1) * limit;

    return { page, limit, offset };
}

function pagingData(rows, total, page, limit) {
    return {
        data: rows,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
}

module.exports = {
    getPagination,
    pagingData
};