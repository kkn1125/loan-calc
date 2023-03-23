import React, { useState, ChangeEvent } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Toolbar from "@mui/material/Toolbar";

interface Column {
  id:
    | "month"
    | "loanOrigin"
    | "creditOrigin"
    | "creditInterest"
    | "creditTotal"
    | "loanCreditTotal"
    | "rest";
  important?: boolean;
  label: string;
  minWidth?: number;
  align?: "left" | "center" | "right";
  format?: (value: number) => string;
}

const columns: Column[] = [
  {
    id: "month",
    label: "개월",
    minWidth: 50,
    align: "center",
    format: (value: number) => value + "개월",
  },
  {
    id: "loanOrigin",
    label: "전세 이자",
    important: true,
    minWidth: 100,
    align: "center",
    format: (value: number) => value.toLocaleString("ko") + "원",
  },
  {
    id: "creditOrigin",
    label: "신용 원금",
    important: true,
    minWidth: 100,
    align: "center",
    format: (value: number) => value.toLocaleString("ko") + "원",
  },
  {
    id: "creditInterest",
    label: "신용 이자",
    important: true,
    minWidth: 100,
    align: "center",
    format: (value: number) => value.toLocaleString("ko") + "원",
  },
  {
    id: "creditTotal",
    label: "신용 원리 합산",
    minWidth: 100,
    align: "center",
    format: (value: number) => value.toLocaleString("ko") + "원",
  },
  {
    id: "loanCreditTotal",
    label: "전 + 신 원리 합산",
    minWidth: 130,
    align: "center",
    format: (value: number) => value.toLocaleString("ko") + "원",
  },
  {
    id: "rest",
    label: "남은 원금",
    minWidth: 100,
    align: "center",
    format: (value: number) => Math.abs(value).toLocaleString("ko") + "원",
  },
];

export default function TableList({
  loan,
  monthly,
}: {
  loan: number;
  monthly: {
    month: number;
    creditOrigin: number;
    creditInterest: number;
    rest: number;
  }[];
}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  function roundTenPosition(cost: number) {
    return Math.round(cost * 0.1) * 10;
  }
  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: (theme) => theme.palette.primary.light,
              }}>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{
                    // top: 57,
                    backgroundColor: "inherit",
                    minWidth: column.minWidth,
                    fontWeight: 700,
                    color: column.important ? "#b63232" : "#000000",
                  }}>
                  {column.label}
                  {column.important ? "*" : ""}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {monthly.length === 0 && (
              <TableRow hover role='checkbox' tabIndex={-1}>
                <TableCell colSpan={columns.length} align={"center"}>
                  내용이 없습니다.
                </TableCell>
              </TableRow>
            )}
            {monthly.length !== 0 &&
              monthly
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, i) => {
                  return (
                    <TableRow
                      hover
                      role='checkbox'
                      tabIndex={-1}
                      key={i + row.creditOrigin}>
                      {columns.map((column, q) => {
                        const value =
                          column.id === "loanOrigin"
                            ? roundTenPosition(loan)
                            : column.id === "creditTotal"
                            ? roundTenPosition(
                                row.creditOrigin + row.creditInterest
                              )
                            : column.id === "month"
                            ? row.month
                            : column.id === "loanCreditTotal"
                            ? roundTenPosition(
                                loan + row.creditOrigin + row.creditInterest
                              )
                            : roundTenPosition(row[column.id]);
                        return (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            sx={{
                              ...(q === 0 && {
                                backgroundColor: (theme) =>
                                  theme.palette.info.main + "56",
                              }),
                            }}>
                            {column.format && typeof value === "number"
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 100]}
        component='div'
        count={monthly.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
