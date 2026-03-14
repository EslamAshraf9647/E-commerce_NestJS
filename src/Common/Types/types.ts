export enum RolesEnum {
  ADMIN = 'admin',
  USER = 'user',
}

export enum GenderEnum {
  MALE = 'male',
  FEMALE = 'female',
}

export enum OTPTypes {
  EMAIL_VERIFICATION = 'email_verification',
  PASSWORD_RESET = 'password_reset',
}

export enum ConversionStatus{
  Open = 'open',
  Closed = 'closed',
}

export enum PaymentMothods{
  CASH_ON_DELIVERY = 'cash_on_delivery',
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  PAYPAL = 'paypal',
}


export enum OrderStatus{
  PENDING = 'pending',
  PLACED = 'placed',
  REFUNDED = "refunded",
  CANCELLED = 'cancelled',
  DELIVERED = 'delivered',
  ON_WAY = 'on_way',
  PAID= "paid",
  PROCESSING = 'processing',
}

export enum CouponsEnums{
  PERCENTAGE = 'percentage',
  FIXED_AMOUNT = 'fixed_amount',
}
