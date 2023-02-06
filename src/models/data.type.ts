
/* !- Flow Types */

export type dataType = Array<{}>;

export type orderType =
{
  column?: string,
  direction?: 'asc' | 'desc',
};

export type paginateType =
{
  page: number,
  limit?: number,
  totalPage?: number,
  results?: dataType | null,
  nextPage?: number | null,
  prevPage?: number | null,
};

export type filterType =
{
  id: string,
  handler: (record: {}, value: string, args?: {}) => boolean,
  arguments: Array<string>,
  status: boolean,
};

export type sortMethodType = (dataType, Function) => boolean;

export interface dataInterface
{
  getResultByIndex(index: number): {} | boolean;
}
