import Link from 'next/link'

export default function Donate() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Donate Food</h2>
            
            <form className="space-y-6">
              {/* Food Details */}
              <div>
                <label htmlFor="food-type" className="block text-sm font-medium text-gray-700">
                  Type of Food
                </label>
                <select
                  id="food-type"
                  name="food-type"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                >
                  <option>Fresh Produce</option>
                  <option>Canned Goods</option>
                  <option>Non-perishables</option>
                  <option>Baked Goods</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <input
                  type="text"
                  name="quantity"
                  id="quantity"
                  className="mt-1 input-field"
                  placeholder="e.g., 2 bags, 5 cans"
                />
              </div>

              <div>
                <label htmlFor="expiry" className="block text-sm font-medium text-gray-700">
                  Expiry Date
                </label>
                <input
                  type="date"
                  name="expiry"
                  id="expiry"
                  className="mt-1 input-field"
                />
              </div>

              {/* Location Details */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Pickup Location
                </label>
                <input
                  type="text"
                  name="location"
                  id="location"
                  className="mt-1 input-field"
                  placeholder="Enter your address"
                />
              </div>

              <div>
                <label htmlFor="pickup-time" className="block text-sm font-medium text-gray-700">
                  Preferred Pickup Time
                </label>
                <input
                  type="datetime-local"
                  name="pickup-time"
                  id="pickup-time"
                  className="mt-1 input-field"
                />
              </div>

              {/* Additional Information */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Additional Information
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  className="mt-1 input-field"
                  placeholder="Any special instructions or additional details about the food"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <Link
                  href="/dashboard"
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Submit Donation
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
} 