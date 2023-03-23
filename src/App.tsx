import {
  Box,
  Container,
  Typography,
  Toolbar,
  Stack,
  TextField,
  Divider,
} from "@mui/material";
import { useState, ChangeEvent, useRef } from "react";
import TableList from "./components/organisms/TableList";
import LoanCalculator from "./models/Loan";

type LoanState =
  | {
      total?: number;
      jeonse?: number;
      credit?: number;
      jeonseRate?: number;
      creditRate?: number;
      jeonseInterest?: number;
      creditInterest?: number;
      jeonsePeriod?: number;
      creditPeriod?: number;
      result?: {
        totalLoan: number;
        totalJeonseInterest: number;
        totalCreditInterest: number;
        sumCreditLoan: number;
        firstMonthTotalLoanCost: number;
        monthlyCost: {
          origin: number;
          month: number;
          interest: number;
          rest: number;
        }[];
      };
    }
  | undefined;

function App() {
  const totalRef = useRef<HTMLInputElement>();
  const jeonseRateRef = useRef<HTMLInputElement>();
  const jeonseInterestRef = useRef<HTMLInputElement>();
  const creditInterestRef = useRef<HTMLInputElement>();
  const jeonsePeriodRef = useRef<HTMLInputElement>();
  const creditPeriodRef = useRef<HTMLInputElement>();
  const [result, setResult] = useState<
    {
      month: number;
      creditOrigin: number;
      creditInterest: number;
      rest: number;
    }[]
  >([]);
  const [loan, setLoan] = useState(0);

  function drawReport({
    total,
    jeonseRate,
    jeonseInterest,
    creditInterest,
    jeonsePeriod,
    creditPeriod,
  }: {
    total: number;
    jeonseRate: number;
    jeonseInterest: number;
    creditInterest: number;
    jeonsePeriod: number;
    creditPeriod: number;
  }) {
    const calc = new LoanCalculator(
      total,
      jeonseRate,
      [jeonseInterest, creditInterest],
      [jeonsePeriod, creditPeriod]
    );
    const report = calc.report();
    setLoan(report.totalJeonseInterest);
    setResult(report.monthlyCost);
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    drawReport({
      total: Number(totalRef.current?.value) || 0,
      jeonseRate: Number(jeonseRateRef.current?.value) || 0,
      jeonseInterest: Number(jeonseInterestRef.current?.value) || 0,
      creditInterest: Number(creditInterestRef.current?.value) || 0,
      jeonsePeriod: Number(jeonsePeriodRef.current?.value) || 0,
      creditPeriod: Number(creditPeriodRef.current?.value) || 0,
    });
  }

  return (
    <Container sx={{ mt: 5 }}>
      <Typography align='center' fontWeight={700} fontSize={32}>
        Loan Cost Report
      </Typography>
      <Toolbar />
      <Box>
        <TableList loan={loan} monthly={result || []} />
      </Box>
      <Toolbar />
      <Stack gap={1}>
        <Stack direction='row' gap={2}>
          <TextField
            inputRef={totalRef}
            type='number'
            onChange={handleChange}
            name='total'
            label='총 대출금'
          />
          <TextField
            inputRef={jeonseRateRef}
            type='number'
            onChange={handleChange}
            name='jeonseRate'
            label='전세대출 비율'
          />
          <TextField
            inputRef={jeonseInterestRef}
            type='number'
            onChange={handleChange}
            name='jeonseInterest'
            label='전세이자'
            inputProps={{ step: 0.01 }}
          />
          <TextField
            inputRef={creditInterestRef}
            type='number'
            onChange={handleChange}
            name='creditInterest'
            label='신용이자'
          />
          <TextField
            inputRef={jeonsePeriodRef}
            type='number'
            onChange={handleChange}
            name='jeonsePeriod'
            label='전세대출 기간'
          />
          <TextField
            inputRef={creditPeriodRef}
            type='number'
            onChange={handleChange}
            name='creditPeriod'
            label='신용대출 기간'
          />
        </Stack>
        <Divider />
        <Stack direction='row' gap={2}>
          <TextField
            type='number'
            name='jeonse'
            label='전세금'
            disabled
            value={
              (Number(totalRef.current?.value) || 0) *
                ((Number(jeonseRateRef.current?.value) || 0) / 100) || 0
            }
          />
          <TextField
            type='number'
            name='credit'
            label='신용대출금'
            disabled
            value={
              (Number(totalRef.current?.value) || 0) *
                ((100 - (Number(jeonseRateRef.current?.value) || 0)) / 100) || 0
            }
          />
        </Stack>
      </Stack>
    </Container>
  );
}

export default App;
