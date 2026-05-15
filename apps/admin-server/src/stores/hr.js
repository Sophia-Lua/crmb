import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as hrApi from '@/api/hr'

export const useHrStore = defineStore('hr', () => {
  const employees = ref([])
  const employeeTotal = ref(0)
  const employeeDetail = ref(null)
  const attendance = ref([])
  const attendanceTotal = ref(0)
  const performance = ref([])
  const performanceTotal = ref(0)
  const loading = ref(false)

  const fetchEmployees = async (params) => {
    loading.value = true
    try {
      const res = await hrApi.getEmployees(params)
      employees.value = res.data.list
      employeeTotal.value = res.data.total
    } finally {
      loading.value = false
    }
  }

  const fetchEmployeeDetail = async (id) => {
    loading.value = true
    try {
      const res = await hrApi.getEmployeeDetail(id)
      employeeDetail.value = res.data
    } finally {
      loading.value = false
    }
  }

  const createEmployee = async (data) => {
    return await hrApi.createEmployee(data)
  }

  const updateEmployee = async (id, data) => {
    return await hrApi.updateEmployee(id, data)
  }

  const fetchAttendance = async (params) => {
    loading.value = true
    try {
      const res = await hrApi.getAttendance(params)
      attendance.value = res.data.list
      attendanceTotal.value = res.data.total
    } finally {
      loading.value = false
    }
  }

  const checkIn = async () => {
    return await hrApi.checkIn()
  }

  const checkOut = async () => {
    return await hrApi.checkOut()
  }

  const fetchPerformance = async (params) => {
    loading.value = true
    try {
      const res = await hrApi.getPerformance(params)
      performance.value = res.data.list
      performanceTotal.value = res.data.total
    } finally {
      loading.value = false
    }
  }

  const createPerformance = async (data) => {
    return await hrApi.createPerformance(data)
  }

  const updatePerformance = async (id, data) => {
    return await hrApi.updatePerformance(id, data)
  }

  return {
    employees, employeeTotal, employeeDetail,
    attendance, attendanceTotal,
    performance, performanceTotal,
    loading,
    fetchEmployees, fetchEmployeeDetail, createEmployee, updateEmployee,
    fetchAttendance, checkIn, checkOut,
    fetchPerformance, createPerformance, updatePerformance
  }
})