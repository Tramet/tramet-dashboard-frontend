export const getCustomers = async () => {
  const response = await fetch("http://localhost:8080/customers");
  const customers = await response.json();
  return customers;
};
