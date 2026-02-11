import { useQuery } from '@tanstack/react-query'
import { getUserShops } from './shop.functions'

export function useGetUserShops({ id }: { id: string }) {
  return useQuery({
    queryKey: ['userShops', id],
    queryFn: () => getUserShops({ data: { id } }),
  })
}
