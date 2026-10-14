import ListedOrdersComp from "@/components/user/freelancer/listedOrdersComp"
import { useState } from "react"

function ListedOrder() {
    const [list, setList] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
  return (
    <div>
      <ListedOrdersComp
      orders={list}
      loading={loading}
      error={error}
      />
    </div>
  )
}

export default ListedOrder
