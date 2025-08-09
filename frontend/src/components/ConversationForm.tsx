import { useEffect, useState } from "react";
import { X } from "lucide-react";



export default function CreateGroupModal({ onSubmit, isOpen, onClose }: any) {
  const [name, setName] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("participantIds", JSON.stringify(selectedUsers.map((u) => u.id)));
    if (avatarFile) formData.append("avatarUrl", avatarFile);
    onSubmit(formData);
  };

  

  useEffect(() => {
    if (!search.trim()) {
      setSearchResults([]);
      return;
    }
    const timeout = setTimeout(() => {
      // TODO: thay bằng API thật, ví dụ: fetch(`/api/users?search=${search}`)
      const dummy = [
        { id: 1, name: "Quan Nguyen", role: "Head of Internship" },
        { id: 2, name: "Trang Nguyen", role: "HR Assistant" },
        { id: 3, name: "Trung Nguyen", role: "Software Engineer Intern" },
      ].filter((u) => u.name.toLowerCase().includes(search.toLowerCase()));
      setSearchResults(dummy);
    }, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  const addUser = (user: any) => {
    if (!selectedUsers.find((u) => u.id === user.id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
    setSearch("");
    setSearchResults([]);
  };

  const removeUser = (id: number) => {
    setSelectedUsers(selectedUsers.filter((u) => u.id !== id));
  };

  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Modal box */}
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-4">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-lg font-semibold">Tạo nhóm mới</h2>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tên nhóm */}
          <div>
            <label className="block text-sm font-medium mb-1">Tên nhóm</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1"
              required
            />
          </div>

          {/* Chọn thành viên */}
          <div>
            <label className="block text-sm font-medium mb-1">Thành viên</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedUsers.map((user) => (
                <span
                  key={user.id}
                  className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                >
                  {user.name}
                  <button
                    type="button"
                    onClick={() => removeUser(user.id)}
                    className="ml-1 text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Nhập tên để tìm..."
              className="w-full border border-gray-300 rounded px-2 py-1"
            />
            {searchResults.length > 0 && (
              <div className="mt-1 border rounded bg-white shadow absolute z-10 w-[calc(100%-2rem)]">
                {searchResults.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => addUser(user)}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.role}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Avatar */}
          <div>
            <label className="block text-sm font-medium mb-1">Avatar</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Tạo nhóm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}