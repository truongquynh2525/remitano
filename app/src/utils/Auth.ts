export const getAuthToken = () => sessionStorage.getItem('token') || null
export const setAuthToken = (value: string) => sessionStorage.setItem('token', value)
export const removeAuthToken = () => sessionStorage.removeItem('token')

export const setAuthUsername = (value: string) => sessionStorage.setItem('username', value)
export const getAuthUsername = () => sessionStorage.getItem('username')
