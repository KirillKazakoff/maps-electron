import { Coordinates, Vessel } from './models';
import { SSDInfo } from '../puppeteer/f16/parseF16/parseF16';
import axios from 'axios';

const baseUrl = 'http://localhost:9092';

const updateZones = async (data: unknown) => {
    await axios.post(`${baseUrl}/zones`, data);
};
const sendSSDInfo = async (data: SSDInfo) => {
    await axios.post(`${baseUrl}/ssd`, data);
};
const sendCoordinates = async (data: Coordinates[]) => {
    await axios.post(`${baseUrl}/coordinates`, data);
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
        coordinates: sendCoordinates,
    },
    get: {
        vesselsByCompany: getVesselsByCompanyId,
        vessel: getVesselById,
    },
};
