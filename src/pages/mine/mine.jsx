import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { View } from '@tarojs/components'

import { Header, Footer } from '../../components'
import './mine.scss'

export default function Mine() {
  const [nickName, setNickName] = useState('')
  const [avatar, setAvatar] = useState('')
  const [isOpened, setIsOpened] = useState(false)
  const [isLogout, setIsLogout] = useState(false)

  // 双取反来构造字符串对应的布尔值，用于标志此时是否用户已经登录
  const isLogged = !!nickName

  useEffect(() => {
    async function getStorage() {
      try {
        const { data } = await Taro.getStorage({ key: 'userInfo' })
        console.log('data'+data.avatar)
        const { nickName, avatar } = data
        setAvatar(avatar)
        setNickName(nickName)
      } catch (err) {
        console.log('getStorage ERR: ', err)
      }
    }

    async function checkSession() {
      checkSessionKey()
    }

    // async function remove(){
    //   await Taro.removeStorage({ key: 'session_key' })
    // }

    getStorage()
    // remove()
    checkSession()
    // saveSessionKeyToStorage('yELpjINEIsOP+4NLvaV5IQ==')
    // getSessionKeyFromStorage()
  })

  async function checkSessionKey(){
    Taro.checkSession({
      success: function () {
        //session_key 未过期，并且在本生命周期一直有效
        getSessionKeyFromStorage()
      },
      fail: function () {
        // session_key 已经失效，需要重新执行登录流程
        console.log('session_key 已经失效，需要重新执行登录流程')
        wxLogin()
      }
    })
  }

  async function getSessionKeyFromStorage(){
    try {
      const data  = await Taro.getStorage({ key: 'session_key' })
      // if(data.data.sessionKey && data.data.sessionKey === ''){
      //   console.log('data'+data.data.sessionKey)
      //   wxLogin()
      // }
    } catch (err) {
      console.log('getStorage ERR: ', err)
      wxLogin()
    }
  }

  async function getSessionKeyFromRequest(code){
    Taro.request({
      url: 'http://jiahao.azeng1990.top/User/getSessionKey?code='+code
    }).then(res => {
      console.log('request'+res.data)
      saveSessionKeyToStorage(res.data)
    })
  }

  async function saveSessionKeyToStorage(sessionKey){
    try {
      await Taro.setStorage({
        key: 'session_key',
        data:  sessionKey ,
      })
    } catch (err) {
      console.log('setStorage ERR: ', err)
    }
  }

  async function wxLogin(){
    console.log("login")
    Taro.login({
      success: function (res) {
        if (res.code) {
          getSessionKeyFromRequest(res.code)
        }
      }
    })
  }

  async function setLoginInfo(avatar, nickName) {
    setAvatar(avatar)
    setNickName(nickName)

    try {
      await Taro.setStorage({
        key: 'userInfo',
        data: { avatar, nickName },
      })
    } catch (err) {
      console.log('setStorage ERR: ', err)
    }
  }

  async function handleLogout() {
    setIsLogout(true)

    try {
      await Taro.removeStorage({ key: 'userInfo' })

      setAvatar('')
      setNickName('')
    } catch (err) {
      console.log('removeStorage ERR: ', err)
    }

    setIsLogout(false)
  }

  function handleSetIsOpened(isOpened) {
    setIsOpened(isOpened)
  }

  function handleClick() {
    handleSetIsOpened(true)
  }

  async function handleSubmit(userInfo) {
    // 缓存在 storage 里面
    await Taro.setStorage({ key: 'userInfo', data: userInfo })

    // 设置本地信息
    setAvatar(userInfo.avatar)
    setNickName(userInfo.nickName)

    // 关闭弹出层
    setIsOpened(false)
  }

  return (
    <View className="mine">
      <Header
        isLogged={isLogged}
        userInfo={{ avatar, nickName }}
        handleClick={handleClick}
        setLoginInfo={setLoginInfo}
      />
      <Footer
        isLogged={isLogged}
        isOpened={isOpened}
        isLogout={isLogout}
        handleLogout={handleLogout}
        handleSetIsOpened={handleSetIsOpened}
        handleSubmit={handleSubmit}
      />
    </View>
  )
}
