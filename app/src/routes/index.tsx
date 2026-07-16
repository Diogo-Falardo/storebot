import { authentication, fake_INITDATA } from '#/server/authentication'
import { createFileRoute } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useEffect } from 'react'

export const Route = createFileRoute('/')({ component: Lobby })

/**
 * Lobby is the "loading" screen + connector of the user to the app
 *
 * __ is responsible for authentication of the app
 * __ allows user to access to its shop or respective dashboard
 * __ displays the user favourit shops
 *
 * */
function Lobby() {
  const _authentication = useServerFn(authentication)

  useEffect(() => {
    const authenticate = async () => {
      try {
        const user = await _authentication({ data: fake_INITDATA })
        console.log(user)
      } catch (error: any) {
        throw new Error(error.message ?? "Authentication failed!")
      }
    }
    authenticate()
  }, [])



  return (


    <div className='min-h-dvh '></div>
  )
}
