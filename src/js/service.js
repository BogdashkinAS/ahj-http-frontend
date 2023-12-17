const TICKET_BASE_URL = 'http://localhost:7070'

export class TicketService {
  static async create (newTicket) {
    const response = await fetch(`${TICKET_BASE_URL}/?method=createTicket`, {
      method: 'POST',
      body: JSON.stringify(newTicket),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return await response.json()
  }

  static async update (ticket) {
    const url = new URL(TICKET_BASE_URL)
    url.searchParams.append('method', 'updateTicket')
    url.searchParams.append('id', ticket.id) // экранизируются

    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(ticket),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const data = await response.json()
    return data;
  }

  static async delete (ticketId) {
    const url = new URL(TICKET_BASE_URL)
    url.searchParams.append('method', 'deleteTicket')
    url.searchParams.append('id', ticketId) // экранизируются
    const response = await fetch(url, {
      method: 'DELETE'
    })
    const data = await response.json()
    return data;
  }

  static async get (ticketId) {
    const url = new URL(TICKET_BASE_URL)
    url.searchParams.append('method', 'ticketById')
    url.searchParams.append('id', ticketId) // экранизируются
    const response = await fetch(url)
    return await response.json()
  }

  static async all () {
    const url = new URL(TICKET_BASE_URL)
    url.searchParams.append('method', 'allTickets')
    const response = await fetch(url)
    return await response.json()
  }

}
