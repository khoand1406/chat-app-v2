import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import Select, { type MultiValue } from "react-select";
import type { UserResponse } from "../models/interfaces/Users";
import { getUsers } from "../services/userServices";
import ApiHelper from "../utils/ApiHelper";
import { CREATE_EVENTS } from "../constants/ApiContants";

interface OptionType {
  value: number;
  label: string;
}

const CreateEventForm: React.FC<{
  onclose: ()=> void;
  defaultDate: Date;
  onSubmit: (data:any) => void;
}> = ({ onclose, defaultDate}) => {
  const [formData, setFormData] = useState({
    
    content: "",
    description: "",
    startDate: dayjs(defaultDate).format("YYYY-MM-DDTHH:mm"),
    endDate: dayjs(defaultDate).format("YYYY-MM-DDTHH:mm"),
    participantIds: [] as number[],
  });
  const [participants, setParticipants] = useState<UserResponse[]>([]);


  const loadParticipants= async()=> {
    try {
      const response= await getUsers();
      setParticipants(response);
      
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=> {
    loadParticipants();
  }, []);

  
  const participantOptions: OptionType[] = participants.map((item) => ({
    label: item.userName,
    value: item.id,
  }));
  const handleSelectChange = (selected: MultiValue<OptionType>) => {
    setFormData({
      ...formData,
      participantIds: selected.map((s) => s.value),
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit =  async (e: React.FormEvent) => {
    try {
      e.preventDefault();

    const payload = {
      ...formData,
      startDate: dayjs(formData.startDate).format("YYYY-MM-DD HH:mm:ss"),
      endDate: dayjs(formData.endDate).format("YYYY-MM-DD HH:mm:ss"),
    };
    const apiHelper= new ApiHelper();
    await apiHelper.postJson(CREATE_EVENTS, payload);
    setFormData({
        
        content: "",
        description: "",
        startDate: "",
        endDate: "",
        participantIds: [],
      });
    onclose();
    } catch (error) {
      console.log(error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      

      <input
        type="text"
        name="content"
        placeholder="Title"
        value={formData.content}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      <input
        type="datetime-local"
        name="startDate"
        value={formData.startDate}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      <input
        type="datetime-local"
        name="endDate"
        value={formData.endDate}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      <Select
        isMulti
        options={participantOptions}
        onChange={handleSelectChange}
        value={participantOptions.filter((opt) =>
          formData.participantIds.includes(opt.value)
        )}
        className="basic-multi-select"
        classNamePrefix="select"
        placeholder="Select participants..."
      />

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Create Event
      </button>
    </form>
  );
};

export default CreateEventForm;
