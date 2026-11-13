export interface Note {
  id: number
  entity_id: number
  created_by: number
  updated_by: number
  created_at: number
  updated_at: number
  responsible_user_id: number
  group_id: number
  note_type: NoteTypes
  params: {
    text: string
    uniq: string
    duration: number
    source: string
    link: string
    phone: string
    call_responsible: string
    service: string
    status: 'created' | 'shown' | 'canceled'
    address: string
    // долгота
    longitude: string
    // широта
    latitude: string
    version_uuid: string // версия файла, можно не передавать, будет использована последняя версия
    file_uuid: string
    file_name: string // название файла, которое будет отображаться в примечании
    // для типа amomail_message
    thread_id: string
    message_id: string
    private: boolean
    income: boolean
    from: {
      email: string
      name: string
    }
    to: {
      email: string
      name: string
    }
    version: number
    subject: string
    access_granted: number
    content_summary: string
    attach_cnt: number
    delivery: {
      status: 'queued' | 'send' | 'delivered'
      time: number
    }
    owner_id: string
    // конец для типа amomail_message
  }
  account_id: number
}

export type NoteTypes =
  | 'common' // Текстовое примечание
  | 'call_in' // Входящий звонок
  | 'call_out' // Исходящий звонок
  | 'service_message' // Системное сообщение (добавляется интеграциями)
  | 'message_cashier' // Сообщение кассиру
  | 'amomail_message' // Письмо
  | 'geolocation' // Текстовое примечание с гео-координатами (добавляются мобильным приложением)
  | 'sms_in' // Входящее SMS
  | 'sms_out' // Исходящее SMS
  | 'extended_service_message' // Расширенное системное сообщение (поддерживает больше текста и сворачивается в интерфейсе)
  | 'attachment' // Примечание с файлом
