import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { Polygon } from '../types';

interface SegmentationListProps {
  polygons: Polygon[];
  editingPolygon: string | null;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Polygon>) => void;
}

export function SegmentationList({
  polygons,
  editingPolygon,
  onEdit,
  onDelete,
  onUpdate,
}: SegmentationListProps) {
  const [polygonName, setPolygonName] = React.useState("");
  const [polygonDetails, setPolygonDetails] = React.useState("");

  return (
    <div className=" bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl shadow-sm">
      <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Segmentation Details
      </h4>
      <div className="space-y-4">
        {polygons.map((polygon) => {
          const isEditing = editingPolygon === polygon.id;
          return (
            <div
              key={polygon.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 flex items-start justify-between shadow-sm border border-gray-200 dark:border-gray-700"
            >
              {isEditing ? (
                <form
                  className="flex-grow mr-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    onUpdate(polygon.id, {
                      name: polygonName,
                      details: polygonDetails,
                    });
                  }}
                >
                  <label className="text-sm font-medium block mb-1 dark:text-gray-100">
                    Name
                  </label>
                  <input
                    value={polygonName}
                    onChange={(ev) => setPolygonName(ev.target.value)}
                    className="border w-full rounded px-2 py-1 text-sm mb-3 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  />
                  <label className="text-sm font-medium block mb-1 dark:text-gray-100">
                    Details
                  </label>
                  <textarea
                    value={polygonDetails}
                    onChange={(ev) => setPolygonDetails(ev.target.value)}
                    className="border w-full rounded px-2 py-1 text-sm mb-3 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => onEdit("")}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-100 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex-grow mr-4">
                  <p className="font-medium text-gray-800 dark:text-gray-100">
                    {polygon.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {polygon.details || "No details provided"}
                  </p>
                </div>
              )}
              <div className="flex flex-col items-center space-y-2">
                {!isEditing && (
                  <button
                    onClick={() => {
                      onEdit(polygon.id);
                      setPolygonName(polygon.name);
                      setPolygonDetails(polygon.details || "");
                    }}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                    title="Edit Polygon"
                  >
                    <Edit2 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </button>
                )}
                <button
                  onClick={() => onDelete(polygon.id)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-red-500"
                  title="Delete Polygon"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}