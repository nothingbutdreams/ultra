import Taro from '@tarojs/taro'
import { Button } from '@tarojs/components'
import {useState} from 'react'

import avatar from '../../images/kuuga.jpg'

export default function LoginButton(props) {
    const [isLogin, setIsLogin] = useState(false)
  
    async function onGetPhoneNumber(e) {
  
      setIsLogin(true)
      
      console.log(isLogin)
      const encryptedData1 = e.detail.encryptedData.replaceAll("+", "%2B")
      const iv1= e.detail.iv.replaceAll("+", "%2B")
      console.log('---encryptedData---'+encryptedData1)
      console.log('---iv---'+iv1)
  
      Taro.checkSession({
        success: function () {
          //session_key 未过期，并且在本生命周期一直有效
          console.log('session_key 未过期，并且在本生命周期一直有效')
          
          getSessionKeyFromStorage()
          getPhone(encryptedData1,iv1)
        },
        fail: function () {
          // session_key 已经失效，需要重新执行登录流程
          console.log('session_key 已经失效，需要重新执行登录流程')
          wxLogin()
          getSessionKeyFromStorage()
          getPhone(encryptedData1,iv1)
        }
      })
      
      setIsLogin(false)
    }
  
    async function getPhone(encryptedData,iv){
      const data = await Taro.getStorage({ key: 'session_key' })
      Taro.request({
        url: 'http://jiahao.azeng1990.top/User/decrypPhone?session_key='+data.data.replaceAll("+", "%2B")+'&encryptedData='+encryptedData+'&iv='+iv
      }).then(res => {
          console.log(res.data)
          props.setLoginInfo(avatar, res.data)
          try {
            Taro.setStorage({
                key: 'phone',
                data:  res.data ,
            })
          } catch (err) {
            console.log('setStorage ERR: ', err)
          }
      })
    }

    async function getSessionKeyFromStorage(){
      try {
        const data  = await Taro.getStorage({ key: 'session_key' })
        console.log('---StorageSessionKey---'+data.data)
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

    return (
      <Button
      openType="getPhoneNumber"
        onGetPhoneNumber={onGetPhoneNumber}
        type="primary"
        className="login-button"
        loading={isLogin}
      >
        绑定手机号
      </Button>
    )
  }