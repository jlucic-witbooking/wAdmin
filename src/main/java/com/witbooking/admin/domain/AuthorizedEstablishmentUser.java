package com.witbooking.admin.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A AuthorizedEstablishmentUser.
 */
@Entity
@Table(name = "T_AUTHORIZEDESTABLISHMENTUSER")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class AuthorizedEstablishmentUser implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    private User user;

    @ManyToOne
    private UserGroup userGroup;

    @ManyToOne
    private Authority authority;

    @ManyToOne
    private BookingEngine bookingEngine;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public UserGroup getUserGroup() {
        return userGroup;
    }

    public void setUserGroup(UserGroup userGroup) {
        this.userGroup = userGroup;
    }

    public Authority getAuthority() {
        return authority;
    }

    public void setAuthority(Authority authority) {
        this.authority = authority;
    }

    public BookingEngine getBookingEngine() {
        return bookingEngine;
    }

    public void setBookingEngine(BookingEngine bookingEngine) {
        this.bookingEngine = bookingEngine;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        AuthorizedEstablishmentUser authorizedEstablishmentUser = (AuthorizedEstablishmentUser) o;

        if ( ! Objects.equals(id, authorizedEstablishmentUser.id)) return false;

        return true;
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "AuthorizedEstablishmentUser{" +
                "id=" + id +
                '}';
    }
}
