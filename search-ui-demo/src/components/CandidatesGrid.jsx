import { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { Tag } from "antd";
import highlight from "../utils/highlight";

// Register all community features once
ModuleRegistry.registerModules([AllCommunityModule]);

const STATUS_COLOR = {
  Applied:   "orange",
  Interview: "blue",
  Hired:     "green",
  Rejected:  "red",
};

// ── Custom cell renderers ──────────────────────────────────────────────────────

/** Renders the candidate name with text highlight */
function NameCell({ value, context }) {
  return <strong>{highlight(value, context.query)}</strong>;
}

/** Renders status as an AntD Tag */
function StatusCell({ value }) {
  return (
    <Tag color={STATUS_COLOR[value] ?? "default"} style={{ margin: 0 }}>
      {value}
    </Tag>
  );
}

/** Renders skills array as coloured tags */
function SkillsCell({ value = [], context }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 4, padding: "4px 0" }}>
      {value.map((skill) => (
        <Tag key={skill} color="purple" style={{ fontSize: 11, margin: 0 }}>
          {highlight(skill, context.query)}
        </Tag>
      ))}
    </div>
  );
}

/** Renders bio with highlight */
function BioCell({ value, context }) {
  return (
    <span style={{ fontSize: 12, color: "#555" }}>
      {highlight(value, context.query)}
    </span>
  );
}

// ── Column definitions ─────────────────────────────────────────────────────────

const COL_DEFS = [
  {
    headerName: "Name",
    field: "name",
    cellRenderer: NameCell,
    width: 160,
    pinned: "left",
  },
  {
    headerName: "Role",
    field: "role",
    width: 180,
  },
  {
    headerName: "Status",
    field: "status",
    cellRenderer: StatusCell,
    width: 120,
  },
  {
    headerName: "Location",
    field: "location",
    width: 140,
  },
  {
    headerName: "Exp. (yrs)",
    field: "experience_years",
    width: 110,
    type: "numericColumn",
  },
  {
    headerName: "Skills",
    field: "skills",
    cellRenderer: SkillsCell,
    flex: 1,
    minWidth: 220,
    autoHeight: true,
    sortable: false,
  },
  {
    headerName: "Bio",
    field: "bio",
    cellRenderer: BioCell,
    flex: 2,
    minWidth: 260,
    autoHeight: true,
    sortable: false,
  },
];

const DEFAULT_COL_DEF = {
  sortable: true,
  resizable: true,
  filter: false,
};

/**
 * CandidatesGrid
 *
 * Props:
 *   rows    — candidate array from MongoDB
 *   query   — current search string (passed to cell renderers for highlighting)
 *   loading — shows overlay while fetching
 */
function CandidatesGrid({ rows, query, loading }) {
  // Pass query down to cell renderers via AG Grid's `context` prop
  const context = useMemo(() => ({ query }), [query]);

  return (
    <div
      className="ag-theme-quartz"
      style={{ width: "100%", height: "calc(100vh - 260px)", minHeight: 400 }}
    >
      <AgGridReact
        rowData={rows}
        columnDefs={COL_DEFS}
        defaultColDef={DEFAULT_COL_DEF}
        context={context}
        rowHeight={48}
        headerHeight={40}
        loadingOverlayComponent={() => <span>Loading…</span>}
        loading={loading}
        getRowId={(params) => params.data._id ?? params.data.id}
        pagination
        paginationPageSize={15}
        paginationPageSizeSelector={[15, 30, 50]}
      />
    </div>
  );
}

export default CandidatesGrid;