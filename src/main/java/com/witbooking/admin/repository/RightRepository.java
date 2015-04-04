package com.witbooking.admin.repository;

import com.witbooking.admin.domain.Right;
import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the Right entity.
 */
public interface RightRepository extends JpaRepository<Right,Long> {

}
