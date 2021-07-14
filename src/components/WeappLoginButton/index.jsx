import Taro from '@tarojs/taro'
import { Button } from '@tarojs/components'
import {useState} from 'react'
import {AtButton} from 'taro-ui'

import './index.scss'

export default function LoginButton(props) {
  const [isLogin, setIsLogin] = useState(false)

  async function onGetUserInfo(e) {

    setIsLogin(true)
    
    // Taro.showModal({
    //   title: '提示',
    //   content: '这是一个模态弹窗',
    //   success: function (res) {
    //     if (res.confirm) {
    //       console.log('用户点击确定')
          Taro.getUserProfile({
            desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
            success: (res) => {
              console.log(res)
              const { avatarUrl, nickName } = res.userInfo
              console.log(res.userInfo.avatarUrl)
              console.log(res.userInfo.nickName)
              props.setLoginInfo(avatarUrl, nickName)
            }
          })
    //     } else if (res.cancel) {
    //       console.log('用户点击取消')
    //     }
    //   }
    // })

    // const { avatarUrl, nickName } = e.detail.userInfo
    // await props.setLoginInfo(avatarUrl, nickName)

    setIsLogin(false)
  }

  // async function onGetPhoneNumber(e) {

  //   setIsLogin(true)
  //   let encryptedData = e.detail.encryptedData.replaceAll("+", "%2B")
  //   let iv= e.detail.iv.replaceAll("+", "%2B")
  //   console.log(encryptedData)
  //   console.log(iv)
    
  //   Taro.login({
  //     success: function (res) {
  //       if (res.code) {
  //         console.log(res.code)
          //发起网络请求
          // Taro.request({
          //   url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wx8d97aba8b49a93ea&secret=ab61030fc80aeace3f1f61103994a1da&js_code='+res.code+'&grant_type=authorization_code'
          // }).then(res => {
          //   console.log(res)
          // })
  //       } else {
  //         console.log('登录失败！' + res.errMsg)
  //       }
  //     }
  //   })

  //   setIsLogin(false)
  // }

  return (
    // <Button
    //   openType="getUserInfo"
    //   onGetUserInfo={onGetUserInfo}
    //   type="primary"
    //   className="login-button"
    //   loading={isLogin}
    // >
    //   微信登录
    // </Button>
    <Button
      onClick={onGetUserInfo}
      type="primary"
      className="login-button"
      loading={isLogin}
    >
      微信登录
    </Button>
    // <Button
    // openType="getPhoneNumber"
    //   onGetPhoneNumber={onGetPhoneNumber}
    //   type="primary"
    //   className="login-button"
    //   loading={isLogin}
    // >
    //   微信手机号登录
    // </Button>
  )
}
