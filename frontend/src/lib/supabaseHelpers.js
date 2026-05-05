// Helper to convert camelCase JS objects to snake_case for Supabase
export const toSnakeCase = (obj) => {
  const map = {
    assignedTo: 'assigned_to',
    dueDate: 'due_date',
    rsvpStatus: 'rsvp_status',
    guestType: 'guest_type',
    plusOne: 'plus_one',
    estimatedCost: 'estimated_cost',
    actualCost: 'actual_cost',
    paidBy: 'paid_by',
    primaryCurrency: 'primary_currency',
    secondaryCurrency: 'secondary_currency',
    exchangeRate: 'exchange_rate',
    weddingDate: 'wedding_date',
  };
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    result[map[key] || key] = value;
  }
  return result;
};

// Helper to convert snake_case Supabase rows to camelCase for JS
export const toCamelCase = (obj) => {
  const map = {
    assigned_to: 'assignedTo',
    due_date: 'dueDate',
    rsvp_status: 'rsvpStatus',
    guest_type: 'guestType',
    plus_one: 'plusOne',
    estimated_cost: 'estimatedCost',
    actual_cost: 'actualCost',
    paid_by: 'paidBy',
    primary_currency: 'primaryCurrency',
    secondary_currency: 'secondaryCurrency',
    exchange_rate: 'exchangeRate',
    wedding_date: 'weddingDate',
    created_at: 'createdAt',
    updated_at: 'updatedAt',
    client_name: 'clientName',
  };
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    result[map[key] || key] = value;
  }
  return result;
};

export const toCamelCaseArray = (arr) => (arr || []).map(toCamelCase);
export const toSnakeCaseArray = (arr) => (arr || []).map(toSnakeCase);
