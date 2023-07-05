import { Vessel } from './models';
import { SSDInfo } from '../xml/parseReportSSD/parseReportSSD';
import axios from 'axios';

const baseUrl = 'http://localhost:9092';

const updateZones = async (data: any) => {
    await axios.post(`${baseUrl}/zones`, data);
};
const sendSSDInfo = async (data: SSDInfo) => {
    await axios.post(`${baseUrl}/ssd`, data);
};
const getVesselById = async (id: string) => {
    const res = await axios.get<Vessel>(`${baseUrl}/vesselsById/${id}`);
    return res.data;
};
const getVesselsByCompanyId = async (companyId: string) => {
    const res = await axios.get<Vessel[]>(`${baseUrl}/vessels/${companyId}`);
    return res.data.map((vessel) => vessel.id);
};

export const api = {
    update: {
        zones: updateZones,
    },
    send: {
        ssdInfo: sendSSDInfo,
    },
    get: {
        vesselsByCompany: getVesselsByCompanyId,
        vessel: getVesselById,
    },
};