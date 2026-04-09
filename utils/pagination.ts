type PaginationArgs = {
    page?: number;
    pageSize?: number;
    search?: string;
};

type PaginationOptions<T> = {
    model: any;
    args: PaginationArgs;
    where?: object;
    include?: object;
    orderBy?: object;
};

export const paginate = async <T>({
    model,
    args,
    where = {},
    include = {},
    orderBy = { createdAt: "desc" },
}: PaginationOptions<T>) => {
    const page = args.page ?? 1;
    const pageSize = args.pageSize ?? 10;
    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
        model.findMany({
            where,
            skip,
            take: pageSize,
            orderBy,
            include,
        }),
        model.count({ where }),
    ]);

    return {
        data,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
    };
};