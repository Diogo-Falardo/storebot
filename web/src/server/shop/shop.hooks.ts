import { useQuery } from '@tanstack/react-query'
import { getUserShopInfo, getUserShops } from './shop.functions'

export function useGetUserShops({ id }: { id: string }) {
  return useQuery({
    queryKey: ['userShops', id],
    queryFn: () => getUserShops({ data: { id } }),
  })
}

export function useGetUserShopInfo({
  userId,
  shopId,
}: {
  userId: string
  shopId: string
}) {
  return useQuery({
    queryKey: ['shop', 'userShops', shopId],
    queryFn: () => getUserShopInfo({ data: { userId, shopId } }),
  })
}
