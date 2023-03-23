type jeonseRate = number;
type creditRate = number;
type jeonseInterestRate = number;
type creditInterestRate = number;
type jeonseInterestPeriod = number;
type creditInterestPeriod = number;

export default class LoanCalculator {
  totalLoan: number = 0;
  jeonse: number = 0;
  credit: number = 0;
  jeonseRate: jeonseRate = 0;
  creditRate: creditRate = 0;
  jeonseLoanInterestRate: jeonseInterestRate = 0;
  creditLoanInterestRate: creditInterestRate = 0;
  jeonseLoanInterestPeriod: jeonseInterestPeriod = 0;
  creditLoanInterestPeriod: creditInterestPeriod = 0;

  constructor(
    totalLoan: number,
    rate: jeonseRate,
    interestRate: [jeonseInterestRate, creditInterestRate],
    period: [jeonseInterestPeriod, creditInterestPeriod]
  ) {
    this.totalLoan = totalLoan;
    this.jeonseRate = rate / 100;
    this.creditRate = (100 - rate) / 100;
    this.jeonse = Math.round(this.totalLoan * this.jeonseRate);
    this.credit = Math.round(this.totalLoan * this.creditRate);
    this.jeonseLoanInterestRate = interestRate[0] / 100;
    this.creditLoanInterestRate = interestRate[1] / 100;
    this.jeonseLoanInterestPeriod = period[0];
    this.creditLoanInterestPeriod = period[1];
    // console.log("총 대출금", this.totalLoan.toLocaleString("ko") + "원");
  }

  report() {
    // const realRate = rate / 100;
    // const realLoanRate = (100 - rate) / 100;
    // const loanCost = totalCost * realRate;
    // const creditLoanCost = totalCost * realLoanRate;
    const loan = this.calculateLoanCostReport(
      this.jeonse,
      this.jeonseLoanInterestRate,
      this.jeonseLoanInterestPeriod
    );
    const creditLoan = this.calculateCreditLoanCostReport(
      this.credit,
      this.creditLoanInterestRate,
      this.creditLoanInterestPeriod
    );
    // console.log("==================================================");
    // console.log(
    //   "월 전세대출 이자".padEnd(27, " "),
    //   loan.toLocaleString("ko") + "원"
    // );
    const originCost = creditLoan?.[0]?.creditOrigin || 0;
    const interestCost = creditLoan?.[0]?.creditInterest || 0;
    const sum = originCost + interestCost;
    // console.log(
    //   "첫 달 신용 원리금 합산".padEnd(25, " "),
    //   sum.toLocaleString("ko") + "원"
    // );
    // console.log(
    //   "첫 달 전세 + 신용 원리금 합산 ✨".padEnd(22, " "),
    //   (loan + sum).toLocaleString("ko") + "원"
    // );
    return {
      totalLoan: this.totalLoan,
      totalJeonseInterest: loan,
      totalCreditInterest: sum,
      firstMonthTotalLoanCost: loan + sum,
      monthlyCost: creditLoan,
    };
  }

  calculateLoanCostReport(
    loanCost: number,
    interestRate: number,
    loanInterestPeriod: number
  ) {
    // console.log("전세대출 금액", loanCost.toLocaleString("ko") + "원");
    const asMonth = loanInterestPeriod * 12;
    return (loanCost * interestRate) / asMonth || 0;
  }

  calculateCreditLoanCostReport(
    loanCost: number,
    interestRate: number,
    loanInterestPeriod: number
  ) {
    let calcCreditLoanCost = loanCost;
    // console.log(
    //   "신용대출 금액",
    //   calcCreditLoanCost.toLocaleString("ko") + "원"
    // );
    const report = [];
    const asMonth = loanInterestPeriod * 12;
    const perMonthprincipal = loanCost / asMonth;

    for (let period = 1; period <= asMonth; period++) {
      const [originCost, loan] = this.originInterest(
        calcCreditLoanCost,
        interestRate,
        perMonthprincipal
      );
      calcCreditLoanCost -= originCost;
      const payCost: {
        [key in "month" | "creditOrigin" | "creditInterest" | "rest"]: number;
      } = {
        month: period,
        creditOrigin: originCost,
        creditInterest: loan,
        rest: calcCreditLoanCost,
      };
      // console.log(
      //   String(period).padStart(2, " ") + "개월",
      //   "원금 " + Math.round(originCost).toLocaleString("ko") + " 원",
      //   "|",
      //   "이자 " + Math.round(loan).toLocaleString("ko") + " 원",
      //   "|",
      //   "남은 원금",
      //   calcCreditLoanCost.toLocaleString?.("ko") + "원" || "끝"
      // );
      report.push(payCost);
    }
    return report;
  }

  originInterest(loanCost: any, loanInterestRate: number, principal: number) {
    const realLoanCost = loanCost;
    const realCreditLoanInterestRate = loanInterestRate;
    const perMonth = realLoanCost * realCreditLoanInterestRate;
    const perMonthLoanCost = perMonth / 12;
    return [principal, perMonthLoanCost];
  }
}
