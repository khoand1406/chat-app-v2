import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import DatePicker from "react-datepicker";
import Select, { type GroupBase } from "react-select";
import { vi } from "date-fns/locale";
import { FiMapPin } from "react-icons/fi";
import "react-datepicker/dist/react-datepicker.css";
import Layout from "../layout/Layout";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  startDate: z.date(),
  endDate: z.date(),
  isAllDay: z.boolean(),
  location: z.string().optional(),
  description: z.string().optional(),
  attendees: z.array(z.object({ value: z.string(), label: z.string() })),
  privacy: z.string(),
  color: z.string(),
  reminders: z.array(z.number())
}).refine((data) => data.endDate >= data.startDate, {
  message: "End date must be after start date",
  path: ["endDate"],
});

// const colorOptions = [
//   { value: "#FF5733", label: "Red" },
//   { value: "#33FF57", label: "Green" },
//   { value: "#3357FF", label: "Blue" },
// ];

const privacyOptions = [
  { value: "public", label: "Public" },
  { value: "private", label: "Private" },
];

const mockAttendees = [
  { value: "1", label: "John Doe" },
  { value: "2", label: "Jane Smith" },
];

const reminderOptions: OptionType[] = [
  { value: "10min", label: "10 minutes before" },
  { value: "30min", label: "30 minutes before" },
  { value: "1h", label: "1 hour before" },
  { value: "1d", label: "1 day before" },
];

type OptionType = {
  value: string;
  label: string;
};

const colorOptions: OptionType[] = [
  { value: "#FF5733", label: "Red" },
  { value: "#33FF57", label: "Green" },
  { value: "#3357FF", label: "Blue" },
];

const CreateEventPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      startDate: new Date(),
      endDate: new Date(),
      isAllDay: false,
      location: "",
      description: "",
      attendees: [],
      privacy: "public",
      color: "#FF5733",
      reminders: []
    }
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      console.log("Form data:", data);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
    <div className="min-h-screen bg-gray-50 overflow-y-auto">
      <header className="sticky top-0 bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Create New Event</h1>
            <div className="space-x-4">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                onClick={() => console.log("Cancel")}
              >
                Cancel
              </button>
              <button
                type="submit"
                form="event-form"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Save Event"}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-[2fr_1fr] gap-8">
          <form id="event-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Event Title *
                    </label>
                    <input
                      type="text"
                      {...field}
                      className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                    )}
                  </div>
                )}
              />

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date and Time
                </label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Controller
                    name="startDate"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        selected={field.value}
                        onChange={field.onChange}
                        showTimeSelect
                        dateFormat="Pp"
                        locale={vi}
                        className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    )}
                  />
                  <Controller
                    name="endDate"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        selected={field.value}
                        onChange={field.onChange}
                        showTimeSelect
                        dateFormat="Pp"
                        locale={vi}
                        className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    )}
                  />
                  
                </div>
              </div>

              <Controller
                name="location"
                control={control}
                render={({ field }) => (
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <div className="relative">
                      <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        {...field}
                        className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}
              />

              <Controller
                name="attendees"
                control={control}
                render={({ field }) => (
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Attendees
                    </label>
                    <Select
                      {...field}
                      isMulti
                      options={mockAttendees}
                      className="basic-multi-select"
                      classNamePrefix="select"
                    />
                  </div>
                )}
              />

              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      {...field}
                      rows={4}
                      className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}
              />
            </div>
          </form>

          <div className="space-y-6 lg:mt-0 mt-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Event Settings</h2>
              
              <Controller
  name="privacy"
  control={control}
  render={({ field }) => (
    <Select
      value={privacyOptions.find(opt => opt.value === field.value)}
      onChange={(val) => field.onChange(val?.value)}
      options={privacyOptions}
    />
  )}
/>

              <Controller
  name="color"
  control={control}
  render={({ field }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Calendar Color
      </label>
      <Select<OptionType, false, GroupBase<OptionType>>
        {...field}
        options={colorOptions}
        className="basic-select"
        classNamePrefix="select"
        onChange={(option) => field.onChange(option?.value)} // ✅ quan trọng
        value={colorOptions.find((c) => c.value === field.value)} // ✅ map value string <-> option object
      />
    </div>
  )}
/>
  <Controller
  name="reminders"
  control={control}
  render={({ field }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Reminders
      </label>
      <Select<OptionType, true, GroupBase<OptionType>>
        isMulti
        options={reminderOptions} // ✅ truyền array option
        className="basic-multi-select"
        classNamePrefix="select"
        value={reminderOptions.filter((opt) =>
          field.value?.toString().includes(opt.value)
        )} // map string[] -> option[]
        onChange={(selected) =>
          field.onChange(selected.map((opt) => opt.value))
        } // map option[] -> string[]
      />
    </div>
  )}
/>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Mini Calendar</h2>
              <DatePicker
                selected={watch("startDate")}
                onChange={() => {}}
                inline
                locale={vi}
              />
            </div>
          </div>
        </div>
      </main>

      {showToast && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg">
          Event saved successfully!
        </div>
      )}
    </div>
    </Layout>
  );
};

export default CreateEventPage;