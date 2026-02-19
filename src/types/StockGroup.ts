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
