type PaginationInput = {
    page?: number;
    limit?: number;
  };
  
  type PaginationOutput = {
    skip: number;
    take: number;
    page: number;
    limit: number;
  };
  
  export const getPagination = (
    input: PaginationInput
  ): PaginationOutput => {
    const page = input.page && input.page > 0 ? input.page : 1;
    const limit =
      input.limit && input.limit > 0 && input.limit <= 100
        ? input.limit
        : 10;
  
    const skip = (page - 1) * limit;
  
    return {
      skip,
      take: limit,
      page,
      limit,
    };
  };