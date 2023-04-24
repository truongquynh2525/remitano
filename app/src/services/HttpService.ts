import { BACKEND_URL } from '../constants'
import { Login, TVoteVideo, User } from "@types";
import { AxiosInstance } from 'axios';

export const loginService = async (httpService: AxiosInstance, payload: Login) => httpService.post(`${BACKEND_URL}/auth/login`, payload)

export const getProfile = async (httpService: AxiosInstance) => httpService.get(`${BACKEND_URL}/auth/profile`)

export const createUserService = async (httpService: AxiosInstance, payload: User) => httpService.post(`${BACKEND_URL}/users`, payload)

export const getVideos = async (httpService: AxiosInstance) => httpService.get(`${BACKEND_URL}/videos`)

export const shareVideo = async (httpService: AxiosInstance, videoUrl: string) => httpService.post(`${BACKEND_URL}/videos`, { videoUrl })

export const getVotesByVideo = async (httpService: AxiosInstance, videoId: string) => httpService.get(`${BACKEND_URL}/votes/thumbs/${videoId}`)

export const voteVideo = async (httpService: AxiosInstance, payload: TVoteVideo) => httpService.post(`${BACKEND_URL}/votes`, payload)

export const voteStatus = async (httpService: AxiosInstance, videoId: string) => httpService.get(`${BACKEND_URL}/votes/status/${videoId}`)
