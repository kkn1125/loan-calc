import {
  Box,
  Container,
  Typography,
  Toolbar,
  Stack,
  TextField,
  Divider,
  Grid,
  FormHelperText,
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

const numberPositionNames = [
  "경",
  "억조",
  "만조",
  "천조",
  "백조",
  "십조",
  "조",
  "만억",
  "천억",
  "백억",
  "십억",
  "억",
  "천만",
  "백만",
  "십만",
  "만",
  "천",
  "백",
  "십",
  "",
];

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

  function numberNaming(cost: number = 0) {
    if (cost) {
      const str = String(cost);
      const result = [];
      const totalLen = numberPositionNames.length;
      const strLen = str.length;
      const gap = totalLen - strLen;
      for (let i = 0; i < strLen; i++) {
        if (str.charAt(i) !== "0") {
          let flag = false;
          const nextSuffix = numberPositionNames?.[gap + i + 1];
          const suffix = numberPositionNames[gap + i];
          if (nextSuffix && str[i + 1] !== "0") {
            if (suffix.slice(-1) === nextSuffix.slice(-1)) {
              flag = true;
            }
          }
          result.push(str.charAt(i) + (flag ? suffix.slice(0, -1) : suffix));
        }
      }
      return result;
    }

    return [0];
  }

  return (
    <Container sx={{ mt: 5 }}>
      <Typography align='center' fontWeight={700} fontSize={32}>
        Loan Cost Report
      </Typography>
      <Box>
        <TableList loan={loan} monthly={result || []} />
      </Box>
      <Toolbar />
      <Stack gap={3}>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <TextField
              inputRef={totalRef}
              type='number'
              onChange={handleChange}
              name='total'
              label='총 대출금'
              defaultValue={0}
              inputProps={{
                min: 0,
                step: 10000000,
              }}
            />
            <FormHelperText>
              {numberNaming(Number(totalRef.current?.value))}원
            </FormHelperText>
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <TextField
              inputRef={jeonseRateRef}
              type='number'
              onChange={handleChange}
              name='jeonseRate'
              label='전세대출 비율'
              defaultValue={0}
              inputProps={{
                min: 0,
                step: 10,
              }}
            />
            <FormHelperText>
              {Number(jeonseRateRef.current?.value || 0)}% (신용대출 비율:
              {100 - Number(jeonseRateRef.current?.value || 0)}%)
            </FormHelperText>
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <TextField
              inputRef={jeonseInterestRef}
              type='number'
              onChange={handleChange}
              name='jeonseInterest'
              label='전세이자'
              defaultValue={0}
              inputProps={{
                min: 0,
                step: 0.01,
              }}
            />
            <FormHelperText>
              {Number(jeonseInterestRef.current?.value || 0)}%
            </FormHelperText>
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <TextField
              inputRef={creditInterestRef}
              type='number'
              onChange={handleChange}
              name='creditInterest'
              label='신용이자'
              defaultValue={0}
              inputProps={{
                min: 0,
                step: 0.01,
              }}
            />
            <FormHelperText>
              {Number(creditInterestRef.current?.value || 0)}%
            </FormHelperText>
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <TextField
              inputRef={jeonsePeriodRef}
              type='number'
              onChange={handleChange}
              name='jeonsePeriod'
              label='전세대출 기간'
              defaultValue={0}
              inputProps={{
                min: 0,
                step: 1,
              }}
            />
            <FormHelperText>
              {Number(jeonsePeriodRef.current?.value || 0)}년 (
              {Math.round(Number(jeonsePeriodRef.current?.value || 0) * 12)}
              개월)
            </FormHelperText>
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <TextField
              inputRef={creditPeriodRef}
              type='number'
              onChange={handleChange}
              name='creditPeriod'
              label='신용대출 기간'
              defaultValue={0}
              inputProps={{
                min: 0,
                step: 1,
              }}
            />
            <FormHelperText>
              {Number(creditPeriodRef.current?.value || 0)}년 (
              {Math.round(Number(creditPeriodRef.current?.value || 0) * 12)}
              개월)
            </FormHelperText>
          </Grid>
        </Grid>
        <Divider />
        <Stack direction='row' gap={2}>
          <Box>
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
            <FormHelperText>
              {numberNaming(
                (Number(totalRef.current?.value) || 0) *
                  ((Number(jeonseRateRef.current?.value) || 0) / 100) || 0
              )}
              원 (총 대출금의 {jeonseRateRef.current?.value}%)
            </FormHelperText>
          </Box>
          <Box>
            <TextField
              type='number'
              name='credit'
              label='신용대출금'
              disabled
              value={
                (Number(totalRef.current?.value) || 0) *
                  ((100 - (Number(jeonseRateRef.current?.value) || 0)) / 100) ||
                0
              }
            />
            <FormHelperText>
              {numberNaming(
                (Number(totalRef.current?.value) || 0) *
                  ((100 - (Number(jeonseRateRef.current?.value) || 0)) / 100) ||
                  0
              )}
              원 (총 대출금의 {100 - Number(jeonseRateRef.current?.value)}%)
            </FormHelperText>
          </Box>
        </Stack>
      </Stack>
      <Toolbar />
    </Container>
  );
}

export default App;
