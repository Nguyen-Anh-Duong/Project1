import { useState } from 'react';

function CommissionForm({ onCalculate }) {
  const [formData, setFormData] = useState({
    distributorId: '',
    amount: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onCalculate({
      ...formData,
      amount: parseFloat(formData.amount)
    });
    setFormData({ distributorId: '', amount: '' });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">
        Tính Hoa Hồng
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Mã nhà phân phối:
          </label>
          <input
            type="text"
            value={formData.distributorId}
            onChange={(e) => setFormData({...formData, distributorId: e.target.value})}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Số tiền bán được:
          </label>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({...formData, amount: e.target.value})}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
            min="0"
            required
          />
        </div>
        <button 
          type="submit"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
        >
          Tính Hoa Hồng
        </button>
      </form>
    </div>
  );
}

export default CommissionForm;