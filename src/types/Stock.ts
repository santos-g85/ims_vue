export interface StockGroup {
  id: number
  groupName: string
  parentGroupId: number | null
  parentGroupName: string | null
}

export interface StockGroupCreate {
  groupName: string
  parentGroupId: number | null
}

export interface StockCategory
{
  id: number
  name: string
  aliasName: string
  parentGroupId: number | null
  parentGroupName: string | null
  parentCategoryId: number | null
  parentCategoryName: string | null
}
