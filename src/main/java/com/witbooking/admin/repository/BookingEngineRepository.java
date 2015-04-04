package com.witbooking.admin.repository;

import com.witbooking.admin.domain.BookingEngine;
import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the BookingEngine entity.
 */
public interface BookingEngineRepository extends JpaRepository<BookingEngine,Long> {

}
