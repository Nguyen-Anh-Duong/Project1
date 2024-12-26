import { useState } from 'react';

function DeleteDistributor({ onDelete }) {
  const [distributorId, setDistributorId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onDelete(distributorId);
    setDistributorId('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">
        Xóa Nhà Phân Phối
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Mã nhà phân phối cần xóa:
          </label>
          <input
            type="text"
            value={distributorId}
            onChange={(e) => setDistributorId(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
            required
          />
        </div>
        <button 
          type="submit"
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
        >
          Xóa
        </button>
      </form>
    </div>
  );
}

export default DeleteDistributor;