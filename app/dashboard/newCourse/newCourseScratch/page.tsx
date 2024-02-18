import React from "react";

export default async function NewCourseScratch() {

  return (
    <div className="flex justify-center space-x-4">
    <form>
      <div className="mb-4">
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
        <input type="text" id="subject" name="subject" required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </div>
      <div className="mb-6">
        <label htmlFor="level" className="block text-sm font-medium text-gray-700">Level</label>
        <select id="level" name="level" required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
          <option value="primary_school">Primary School</option>
          <option value="highschool">Highschool</option>
          <option value="university">University</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>
      <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Submit</button>
    </form>
    </div>
  );
}
