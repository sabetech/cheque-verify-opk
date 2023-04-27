import React from 'react';
import { Card, Header, Grid } from 'semantic-ui-react';
import { useQuery } from 'react-query';
import { useAuthHeader } from 'react-auth-kit';
import { getCheques } from '../services/ChequeApi';

const Summaries = () => {
    const auth = useAuthHeader();
    const { data } = useQuery(['cheques'], () => getCheques(auth()));
    const [pending, setPending] = React.useState<number>(0);
    const [pendingTotalAmount, setPendingAmount] = React.useState<number>(0);

    const [overDue, setOverDue] = React.useState<number>(0);
    const [overDueTotalAmount, setOverDueAmount] = React.useState<number>(0);

    const [cleared, setCleared] = React.useState<number>(0);
    const [clearedTotalAmount, setClearedAmount] = React.useState<number>(0);

    React.useEffect(() => {
        if (data) {
            const numberFormatter = Intl.NumberFormat('en-US');
            console.log("DATA", data)

            const pendingCheques = data.filter((item: any) => item.status.toLowerCase() === 'pending');
            const pendingAmount = pendingCheques.reduce((a: any, b: any) => a + parseFloat(b.amount), 0);
            setPending(pendingCheques.length);
            setPendingAmount(pendingAmount);

            const overDueCheques = data.filter((item: any) => item.date_due < new Date().toISOString());
            const overDueAmount = overDueCheques.reduce((a: any, b: any) => a + parseFloat(b.amount), 0);
            setOverDue(overDueCheques.length);
            setOverDueAmount(overDueAmount);

            const clearedCheques = data.filter((item: any) => item.status.toLowerCase() === 'cleared');
            const clearedAmount = clearedCheques.reduce((a: any, b: any) => a + parseFloat(b.amount), 0);
            setCleared(clearedCheques.length);
            setClearedAmount(clearedAmount);

        }
    }, [data]);

    return (
        <Grid >
            <Header as='h2' style={{ marginTop: '1em' }}>Summaries</Header>
            <Grid.Row >
                <Grid.Column width={5}>
                    <Card
                        href='#card-example-link-card'
                        header='Pending Cheques'
                        meta={`${pending} Cheques`}
                        description={<Header as='h1'>GHC {Intl.NumberFormat('en-US').format(pendingTotalAmount)}</Header>}
                    />
                </Grid.Column>
                <Grid.Column width={5}>
                    <Card
                        href='#card-example-link-card'
                        header='Overdue Cheques'
                        meta={overDue > 0 ? `${overDue} Cheques` : 'No Overdue Cheques'}
                        description={<Header as='h1'>GHC {Intl.NumberFormat('en-US').format(overDueTotalAmount)}</Header>}
                    />
                </Grid.Column>
                <Grid.Column width={4}>
                    <Card
                        href='#card-example-link-card'
                        header='Cleared Cheques'
                        meta={ cleared > 0 ? `${cleared} Cheques` : 'No Cleared Cheques'}
                        description={<Header as='h1'>GHC {Intl.NumberFormat('en-US').format(clearedTotalAmount)}</Header>}
                    />
                </Grid.Column>
            </Grid.Row>
      </Grid>
    );
}

export default Summaries;