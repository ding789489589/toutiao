// 对token进行的操作




//添加token
export const setItem = (key,val)=>{
    if(typeof val == 'object'){
      localStorage.setItem(key,JSON.stringify(val))   
    }else{
      localStorage.setItem(key,val)  
    }
    
}

//获取token
export const getItem = (item) => {
   const data = window.localStorage.getItem(item)
    try {
     
      return JSON.parse(data)
    } catch (err) {
      return data
    }
}

console.log(getItem('kandiansha'),2313123);
//删除token
export const removeItem = (key) => {
    window.localStorage.removeItem(key)
}