function toggleCoupon(couponCode, activate) {
    const action = activate ? 'activate' : 'block';

    Swal.fire({
        title: `Are you sure?`,
        text: `You are about to ${action} coupon ${couponCode}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: `Yes, ${action} it!`,
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`/admin/coupons/${couponCode}/toggle`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ isActive: activate })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    Swal.fire('Success', data.message, 'success').then(() => location.reload());
                } else {
                    Swal.fire('Error', data.message, 'error');
                }
            })
            .catch(error => {
                console.error('Error toggling coupon:', error);
                Swal.fire('Error', 'Something went wrong', 'error');
            });
        }
    });
}
