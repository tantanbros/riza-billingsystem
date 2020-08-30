import React from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import {
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Button,
  Box,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  InputAdornment,
  IconButton,
  makeStyles,
  Typography
} from '@material-ui/core';
import ClearRoundedIcon from '@material-ui/icons/ClearRounded';
import red from '@material-ui/core/colors/red';
import RequiredTextField from 'src/components/RequiredTextField';
import { useForm, useFieldArray } from 'react-hook-form';
import { toCurrency } from 'src/helpers/numbers';
import InvoiceContext from 'src/contexts/InvoiceContext';

const useStyles = makeStyles(theme => ({
  buttonGrid: {
    padding: theme.spacing(2)
  },
  button: {
    minWidth: '12em'
  },
  amountMargin: {
    marginRight: theme.spacing(1)
  },
  removeIcon: {
    fontSize: 30,
    color: red[700]
  }
}));

const BillingInformation = ({ onSubmit }) => {
  const classes = useStyles();
  const emptyItem = () => ({ id: uuid(), description: '', amount: 0 });
  const { totalAmount, setTotalAmount } = React.useContext(InvoiceContext);
  const [values, setValues] = React.useState([]);

  // React Hook Form
  const { getValues, register, control, handleSubmit, errors } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: { billingItems: [emptyItem()] }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'billingItems'
  });

  const handleAmountChange = (alternateValues = []) => {
    const billingItems = getValues().billingItems || alternateValues;
    const total = billingItems
      .map(billingItem => parseFloat(billingItem.amount) || 0)
      .reduce((acc, cur) => acc + cur, 0);

    setValues(billingItems);
    setTotalAmount(total);
  };

  const addBillingItem = () => {
    append(emptyItem());
  };

  const removeBillingItem = index => {
    if (fields.length <= 1) return;

    // update the values state first because the getValues().billingitems will be gone after remove
    const newValues = [...values];
    newValues.splice(index, 1);

    // we remove the item and call the change w/ our new values
    remove(index);
    handleAmountChange(newValues);
  };

  const getDescriptionError = i => errors.billingItems && errors.billingItems[i]?.description;
  const getAmountError = i => errors.billingItems && errors.billingItems[i]?.amount;

  return (
    <Card>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <CardHeader
          title="Billing Information"
          subheader="Charge the following items to customer"
        />
        <Divider />
        <CardContent>
          {fields.map((billingItem, index) => (
            <Grid
              key={billingItem.id}
              container
              spacing={3}
              justify="flex-start"
              alignItems="center"
            >
              <Grid item md={8} xs={12}>
                <RequiredTextField
                  name={`billingItems[${index}].description`}
                  error={getDescriptionError(index)}
                  label="Description"
                  register={register}
                />
              </Grid>
              <Grid item md={4} xs={12}>
                <Box display="flex">
                  <FormControl fullWidth className={classes.amountMargin} variant="outlined">
                    <InputLabel
                      htmlFor="outlined-adornment-amount"
                      required
                      error={!!getAmountError(index)}
                    >
                      Amount
                    </InputLabel>
                    <OutlinedInput
                      name={`billingItems[${index}].amount`}
                      inputRef={register({ required: 'This field is required' })}
                      type="number"
                      startAdornment={<InputAdornment position="start">₱</InputAdornment>}
                      labelWidth={70}
                      required
                      error={!!getAmountError(index)}
                      onChange={handleAmountChange}
                      defaultValue={(0.0).toFixed(2)}
                    />
                    <FormHelperText error={!!getAmountError(index)}>
                      {getAmountError(index) ? getAmountError(index).message : ''}
                    </FormHelperText>
                  </FormControl>
                  <IconButton aria-label="remove" onClick={() => removeBillingItem(index)}>
                    <ClearRoundedIcon className={classes.removeIcon} />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>
          ))}
        </CardContent>
        <Divider />
        <CardContent>
          <Grid container spacing={3} justify="flex-end" alignItems="center">
            <Grid item md={8} xs={12}>
              <Typography variant="h4" align="right">
                Total Amount
              </Typography>
            </Grid>
            <Grid item md={4} xs={12}>
              <FormControl fullWidth className={classes.amountMargin} variant="outlined">
                <OutlinedInput
                  readOnly
                  value={toCurrency(totalAmount).toString()}
                  startAdornment={<InputAdornment position="start">₱</InputAdornment>}
                />
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <Grid className={classes.buttonGrid} container spacing={2} justify="flex-end">
          <Grid item>
            <Button
              className={classes.button}
              color="primary"
              variant="outlined"
              onClick={addBillingItem}
            >
              Add Charge
            </Button>
          </Grid>
          <Grid item>
            <Button className={classes.button} color="primary" variant="contained" type="submit">
              Submit Invoice
            </Button>
          </Grid>
        </Grid>
      </form>
    </Card>
  );
};

BillingInformation.propTypes = {
  onSubmit: PropTypes.func
};

export default BillingInformation;
