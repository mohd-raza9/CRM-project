import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import LeadCard from "./LeadCard";
import API from "../../api/axios";
import toast from "react-hot-toast";

const PIPELINE_STAGES = [
  { id: "new", label: "New Lead", color: "border-blue-400", bg: "bg-blue-50" },
  { id: "contacted", label: "Contacted", color: "border-violet-400", bg: "bg-violet-50" },
  { id: "requirement_collected", label: "Req. Collected", color: "border-amber-400", bg: "bg-amber-50" },
  { id: "property_suggested", label: "Property Suggested", color: "border-emerald-400", bg: "bg-emerald-50" },
  { id: "visit_scheduled", label: "Visit Scheduled", color: "border-indigo-400", bg: "bg-indigo-50" },
  { id: "visit_completed", label: "Visit Completed", color: "border-pink-400", bg: "bg-pink-50" },
  { id: "booked", label: "Booked", color: "border-green-400", bg: "bg-green-50" },
  { id: "lost", label: "Lost", color: "border-red-400", bg: "bg-red-50" },
];

const KanbanBoard = ({ leads, setLeads }) => {
  const onDragEnd = async (result) => {
    const { draggableId, destination, source } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const newStatus = destination.droppableId;

    // Optimistic update
    setLeads((prev) =>
      prev.map((l) => (l._id === draggableId ? { ...l, status: newStatus } : l))
    );

    try {
      await API.patch(`/leads/${draggableId}`, { status: newStatus });
      toast.success(`Lead moved to "${PIPELINE_STAGES.find(s => s.id === newStatus)?.label}"`);
    } catch (err) {
      toast.error("Failed to update lead status");
      // Revert
      setLeads((prev) =>
        prev.map((l) =>
          l._id === draggableId
            ? { ...l, status: source.droppableId }
            : l
        )
      );
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4" style={{ minHeight: "70vh" }}>
        {PIPELINE_STAGES.map((stage) => {
          const stageLeads = leads.filter((l) => l.status === stage.id);

          return (
            <Droppable key={stage.id} droppableId={stage.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`min-w-[260px] w-[260px] rounded-xl p-3 border-t-4 ${
                    stage.color
                  } ${
                    snapshot.isDraggingOver ? "bg-blue-50" : "bg-gray-50"
                  } transition-colors`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                      {stage.label}
                    </h3>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${stage.bg} text-gray-700`}
                    >
                      {stageLeads.length}
                    </span>
                  </div>

                  <div className="space-y-0 min-h-[100px]">
                    {stageLeads.map((lead, index) => (
                      <Draggable
                        key={lead._id}
                        draggableId={lead._id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`${
                              snapshot.isDragging ? "rotate-2 shadow-lg" : ""
                            } transition-transform`}
                          >
                            <LeadCard lead={lead} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;